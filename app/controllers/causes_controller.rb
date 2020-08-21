class CausesController < ApplicationController
  
  def index
    @causes = Cause.all
    render json: @causes
  end

  def show
    @cause = Cause.find(params[:id])
    if @cause
        @cause.update_stats
        render json: @cause 
    else
        render json: {error: "No cause with that id exists"}
    end
  end

  private

  def causes_params
    params.require(:cause).permit(
      :name,
      :owner,
      :description,
      :fund_goal,
      :fund_donated,
      :fund_status,
      :hour_goal,
      :hour_donated,
      :hour_status,
      :start_date,
      :end_date,
      :status,
      :org_id
    )
  end

end
