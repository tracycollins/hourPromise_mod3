class CommitmentsController < ApplicationController
  
  def create
    @commitment = Commitment.new(commitment_params)
    # byebug
    if @commitment
      @commitment.save
      render json: @commitment 
    else
      render json: {error: "Commitment create error"}
    end
  end

  private

  def commitment_params
    params.require(:commitment).permit(
      :fund_start_date,
      :fund_end_date,
      :fund_goal,
      :fund_donated,
      :fund_amount,
      :fund_recurring,

      :hour_start_date,
      :hour_end_date,
      :hour_goal,
      :hour_amount,
      :hour_donated,
      :hour_recurring,

      :status,
      :user_id, 
      :cause_id
    )
  end

end
