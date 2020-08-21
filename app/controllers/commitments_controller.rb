class CommitmentsController < ApplicationController
  
  def index
    @commitments = Commitment.all
    render json: @commitments
  end

  def payment_valid?
    true
  end

  def testtime

    sim_date = Date.parse(params[:simulated_date])

    paymentArray = []

    @commitments = Commitment.all

    @commitments.each { |commitment|
      if sim_date.after?(commitment.fund_start_date) && sim_date.before?(commitment.fund_end_date) && (sim_date == sim_date.beginning_of_month)
        # byebug
        p = Payment.create({
          user: commitment.user,
          commitment: commitment,
          date: params[:simulated_date],
          hour_amount: commitment.hour_amount,          
          fund_amount: commitment.fund_amount         
        })
        paymentArray << p
        commitment.update_stats
      end
    }

    render json: {params: params, payments: paymentArray}
  end

  def show
    @commitment = Commitment.find(params[:id])
    if @commitment
        @commitment.update_stats
        render json: @commitment 
    else
        render json: {error: "No commitment with that id exists"}
    end
  end


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
      :fund_status,

      :hour_start_date,
      :hour_end_date,
      :hour_goal,
      :hour_amount,
      :hour_donated,
      :hour_recurring,
      :hour_status,

      :status,
      :user_id, 
      :cause_id,

      :simulated_date
    )
  end

end
