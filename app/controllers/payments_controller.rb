class PaymentsController < ApplicationController

  def index
    @payments = Payment.all
    render json: @payments
  end

  def create
    @payment = Payment.new(payment_params)
    if @payment
      @payment.save
      commitment = @payment.commitment.update_stats
      render json: commitment 
    else
      render json: {error: "Payment create error"}
    end
  end

  def show
    @payment = Payment.find(params[:id])
    if @payment
        render json: @payment 
    else
        render json: {error: "No payment with that id exists"}
    end
  end
  
  private

  def payment_params
    params.require(:payment).permit(
      :date,
      :fund_amount,
      :hour_amount,

      :user_id, 
      :commitment_id
    )
  end
end
