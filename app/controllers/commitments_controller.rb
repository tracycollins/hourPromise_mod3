class CommitmentsController < ApplicationController
  def create
    @commitment = Commitment.new(commitment_params)
    byebug
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
      :user_id, 
      :cause_id, 
      :start_date,
      :created_date,
      :fund_amount,
      :fund_recurring,
      :funds_donated,
      :hour_amount,
      :hour_recurring,
      :hours_donated,
      :status
    )
  end

end
