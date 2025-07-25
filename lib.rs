use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("FJrrovqzB2DMbSEHRgKxVRE1jZEQG9QU1ShSwthcNusg");

#[program]
pub mod detox_mine {
    use super::*;

    pub fn initialize_program(
        ctx: Context<InitializeProgram>,
        wellness_pool_bump: u8,
    ) -> Result<()> {
        let program_state = &mut ctx.accounts.program_state;
        program_state.authority = ctx.accounts.authority.key();
        program_state.wellness_pool = ctx.accounts.wellness_pool.key();
        program_state.wellness_pool_bump = wellness_pool_bump;
        program_state.total_staked = 0;
        program_state.total_goals_completed = 0;
        program_state.total_goals_failed = 0;

        Ok(())
    }

    pub fn create_user_profile(ctx: Context<CreateUserProfile>) -> Result<()> {
        let user_profile = &mut ctx.accounts.user_profile;
        user_profile.user = ctx.accounts.user.key();
        user_profile.total_staked = 0;
        user_profile.goals_completed = 0;
        user_profile.goals_failed = 0;
        user_profile.current_streak = 0;
        user_profile.longest_streak = 0;
        user_profile.last_activity = Clock::get()?.unix_timestamp;

        Ok(())
    }

    pub fn stake_for_goal(
        ctx: Context<StakeForGoal>,
        stake_amount: u64,
        usage_time_limit: u32,       // in minutes per day
        goal_duration: u32,          // in days
        target_user: Option<Pubkey>, // None for self, Some(pubkey) for staking for others
    ) -> Result<()> {
        require!(stake_amount > 0, DetoxError::InvalidStakeAmount);
        require!(usage_time_limit > 0, DetoxError::InvalidTimeLimit);
        require!(
            goal_duration > 0 && goal_duration <= 365,
            DetoxError::InvalidDuration
        );

        let goal = &mut ctx.accounts.goal;
        let user_profile = &mut ctx.accounts.user_profile;
        let program_state = &mut ctx.accounts.program_state;
        let clock = Clock::get()?;

        // Transfer tokens from user to escrow
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.escrow_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, stake_amount)?;

        // Initialize goal
        goal.staker = ctx.accounts.user.key();
        goal.target_user = target_user.unwrap_or(ctx.accounts.user.key());
        goal.stake_amount = stake_amount;
        goal.usage_time_limit = usage_time_limit;
        goal.goal_duration = goal_duration;
        goal.start_time = clock.unix_timestamp;
        goal.end_time = clock.unix_timestamp + (goal_duration as i64 * 24 * 60 * 60);
        goal.status = GoalStatus::Active;
        goal.days_completed = 0;
        goal.escrow_bump = ctx.bumps.escrow_token_account;

        // Update stats
        user_profile.total_staked += stake_amount;
        program_state.total_staked += stake_amount;

        emit!(GoalCreated {
            goal: goal.key(),
            staker: goal.staker,
            target_user: goal.target_user,
            stake_amount,
            usage_time_limit,
            goal_duration,
        });

        Ok(())
    }

    pub fn report_daily_usage(
        ctx: Context<ReportDailyUsage>,
        usage_minutes: u32,
        date: i64, // Unix timestamp for the date
    ) -> Result<()> {
        let goal = &mut ctx.accounts.goal;
        let clock = Clock::get()?;

        require!(goal.status == GoalStatus::Active, DetoxError::GoalNotActive);
        require!(
            clock.unix_timestamp <= goal.end_time,
            DetoxError::GoalExpired
        );

        // Verify the user is authorized to report (either staker or target user)
        require!(
            ctx.accounts.reporter.key() == goal.staker
                || ctx.accounts.reporter.key() == goal.target_user,
            DetoxError::UnauthorizedReporter
        );

        // Check if usage is within limit
        if usage_minutes <= goal.usage_time_limit {
            goal.days_completed += 1;

            emit!(DailyGoalMet {
                goal: goal.key(),
                date,
                usage_minutes,
                days_completed: goal.days_completed,
            });
        } else {
            // Goal failed for the day
            emit!(DailyGoalFailed {
                goal: goal.key(),
                date,
                usage_minutes,
                limit: goal.usage_time_limit,
            });
        }

        Ok(())
    }

    pub fn finalize_goal(ctx: Context<FinalizeGoal>) -> Result<()> {
        let goal = &mut ctx.accounts.goal;
        let user_profile = &mut ctx.accounts.user_profile;
        let program_state = &mut ctx.accounts.program_state;
        let clock = Clock::get()?;

        require!(goal.status == GoalStatus::Active, DetoxError::GoalNotActive);
        require!(
            clock.unix_timestamp >= goal.end_time,
            DetoxError::GoalNotExpired
        );

        let success_threshold = (goal.goal_duration as f32 * 0.8) as u32; // 80% completion required
        let goal_completed = goal.days_completed >= success_threshold;

        if goal_completed {
            // Return stake to user
            goal.status = GoalStatus::Completed;
            program_state.total_goals_completed += 1;
            user_profile.goals_completed += 1;
            user_profile.current_streak += 1;

            if user_profile.current_streak > user_profile.longest_streak {
                user_profile.longest_streak = user_profile.current_streak;
            }

            // Transfer tokens back to user
            let goal_key = goal.key();
            let seeds = &[b"escrow".as_ref(), goal_key.as_ref(), &[goal.escrow_bump]];
            let signer = &[&seeds[..]];

            let cpi_accounts = Transfer {
                from: ctx.accounts.escrow_token_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.escrow_token_account.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
            token::transfer(cpi_ctx, goal.stake_amount)?;

            emit!(GoalCompleted {
                goal: goal.key(),
                staker: goal.staker,
                target_user: goal.target_user,
                stake_returned: goal.stake_amount,
                days_completed: goal.days_completed,
            });
        } else {
            // Transfer stake to wellness pool
            goal.status = GoalStatus::Failed;
            program_state.total_goals_failed += 1;
            user_profile.goals_failed += 1;
            user_profile.current_streak = 0;

            let goal_key = goal.key();
            let seeds = &[b"escrow".as_ref(), goal_key.as_ref(), &[goal.escrow_bump]];
            let signer = &[&seeds[..]];

            let cpi_accounts = Transfer {
                from: ctx.accounts.escrow_token_account.to_account_info(),
                to: ctx.accounts.wellness_pool.to_account_info(),
                authority: ctx.accounts.escrow_token_account.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
            token::transfer(cpi_ctx, goal.stake_amount)?;

            emit!(GoalFailed {
                goal: goal.key(),
                staker: goal.staker,
                target_user: goal.target_user,
                stake_forfeited: goal.stake_amount,
                days_completed: goal.days_completed,
            });
        }

        user_profile.last_activity = clock.unix_timestamp;
        Ok(())
    }

    pub fn distribute_wellness_rewards(
        ctx: Context<DistributeWellnessRewards>,
        recipients: Vec<Pubkey>,
        amounts: Vec<u64>,
    ) -> Result<()> {
        require!(
            ctx.accounts.authority.key() == ctx.accounts.program_state.authority,
            DetoxError::UnauthorizedAuthority
        );
        require!(
            recipients.len() == amounts.len(),
            DetoxError::MismatchedArrays
        );

        let seeds = &[
            b"wellness_pool".as_ref(),
            &[ctx.accounts.program_state.wellness_pool_bump],
        ];
        let signer = &[&seeds[..]];

        for (recipient, amount) in recipients.iter().zip(amounts.iter()) {
            // This would require dynamic account creation for each recipient
            // In practice, you'd batch these or use a different approach
            emit!(WellnessRewardDistributed {
                recipient: *recipient,
                amount: *amount,
            });
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeProgram<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 1 + 8 + 4 + 4, // discriminator + authority + wellness_pool + bump + total_staked + goals_completed + goals_failed
        seeds = [b"program_state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        init,
        payer = authority,
        token::mint = token_mint,
        token::authority = wellness_pool,
        seeds = [b"wellness_pool"],
        bump
    )]
    pub wellness_pool: Account<'info, TokenAccount>,

    pub token_mint: Account<'info, anchor_spl::token::Mint>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct CreateUserProfile<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8 + 4 + 4 + 4 + 4 + 8, // discriminator + user + total_staked + goals_completed + goals_failed + current_streak + longest_streak + last_activity
        seeds = [b"user_profile", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StakeForGoal<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 4 + 4 + 8 + 8 + 1 + 4 + 1 + 2056, // discriminator + staker + target_user + stake_amount + usage_time_limit + goal_duration + start_time + end_time + status + days_completed + escrow_bump
        seeds = [b"goal", user.key().as_ref(), &Clock::get().unwrap().unix_timestamp.to_le_bytes()],
        bump
    )]
    pub goal: Account<'info, Goal>,

    #[account(
        mut,
        seeds = [b"user_profile", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(
        mut,
        seeds = [b"program_state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        init,
        payer = user,
        token::mint = token_mint,
        token::authority = escrow_token_account,
        seeds = [b"escrow", goal.key().as_ref()],
        bump
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,

    pub token_mint: Account<'info, anchor_spl::token::Mint>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ReportDailyUsage<'info> {
    #[account(mut)]
    pub goal: Account<'info, Goal>,

    pub reporter: Signer<'info>,
}

#[derive(Accounts)]
pub struct FinalizeGoal<'info> {
    #[account(mut)]
    pub goal: Account<'info, Goal>,

    #[account(
        mut,
        seeds = [b"user_profile", goal.target_user.as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,

    #[account(
        mut,
        seeds = [b"program_state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        mut,
        seeds = [b"escrow", goal.key().as_ref()],
        bump = goal.escrow_bump
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"wellness_pool"],
        bump = program_state.wellness_pool_bump
    )]
    pub wellness_pool: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct DistributeWellnessRewards<'info> {
    #[account(
        seeds = [b"program_state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        mut,
        seeds = [b"wellness_pool"],
        bump = program_state.wellness_pool_bump
    )]
    pub wellness_pool: Account<'info, TokenAccount>,

    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct ProgramState {
    pub authority: Pubkey,          // 32 bytes
    pub wellness_pool: Pubkey,      // 32 bytes
    pub wellness_pool_bump: u8,     // 1 byte
    pub total_staked: u64,          // 8 bytes
    pub total_goals_completed: u32, // 4 bytes
    pub total_goals_failed: u32,    // 4 bytes
}

#[account]
pub struct UserProfile {
    pub user: Pubkey,         // 32 bytes
    pub total_staked: u64,    // 8 bytes
    pub goals_completed: u32, // 4 bytes
    pub goals_failed: u32,    // 4 bytes
    pub current_streak: u32,  // 4 bytes
    pub longest_streak: u32,  // 4 bytes
    pub last_activity: i64,   // 8 bytes
}

#[account]
pub struct Goal {
    pub staker: Pubkey,        // 32 bytes
    pub target_user: Pubkey,   // 32 bytes
    pub stake_amount: u64,     // 8 bytes
    pub usage_time_limit: u32, // 4 bytes
    pub goal_duration: u32,    // 4 bytes
    pub start_time: i64,       // 8 bytes
    pub end_time: i64,         // 8 bytes
    pub status: GoalStatus,    // 1 byte (enum)
    pub days_completed: u32,   // 4 bytes
    pub escrow_bump: u8,       // 1 byte
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GoalStatus {
    Active,
    Completed,
    Failed,
}

#[event]
pub struct GoalCreated {
    pub goal: Pubkey,
    pub staker: Pubkey,
    pub target_user: Pubkey,
    pub stake_amount: u64,
    pub usage_time_limit: u32,
    pub goal_duration: u32,
}

#[event]
pub struct DailyGoalMet {
    pub goal: Pubkey,
    pub date: i64,
    pub usage_minutes: u32,
    pub days_completed: u32,
}

#[event]
pub struct DailyGoalFailed {
    pub goal: Pubkey,
    pub date: i64,
    pub usage_minutes: u32,
    pub limit: u32,
}

#[event]
pub struct GoalCompleted {
    pub goal: Pubkey,
    pub staker: Pubkey,
    pub target_user: Pubkey,
    pub stake_returned: u64,
    pub days_completed: u32,
}

#[event]
pub struct GoalFailed {
    pub goal: Pubkey,
    pub staker: Pubkey,
    pub target_user: Pubkey,
    pub stake_forfeited: u64,
    pub days_completed: u32,
}

#[event]
pub struct WellnessRewardDistributed {
    pub recipient: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum DetoxError {
    #[msg("Invalid stake amount")]
    InvalidStakeAmount,
    #[msg("Invalid time limit")]
    InvalidTimeLimit,
    #[msg("Invalid duration")]
    InvalidDuration,
    #[msg("Goal is not active")]
    GoalNotActive,
    #[msg("Goal has expired")]
    GoalExpired,
    #[msg("Goal has not expired yet")]
    GoalNotExpired,
    #[msg("Unauthorized reporter")]
    UnauthorizedReporter,
    #[msg("Unauthorized authority")]
    UnauthorizedAuthority,
    #[msg("Mismatched array lengths")]
    MismatchedArrays,
}
