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
      :fund_target,
      :fund_donated,
      :hour_target,
      :hour_donated,
      :start_date,
      :end_date,
      :status,
      :org_id
    )
  end

end
