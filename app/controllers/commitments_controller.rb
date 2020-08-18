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
      :end_date,
      :fund_amount,
      :hour_amount,
      :payment_number
    )
  end

end
