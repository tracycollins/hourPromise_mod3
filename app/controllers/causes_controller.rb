class CausesController < ApplicationController
  
  def index
    @causes = Cause.all
    render json: @causes
  end

  private

  def causes_params
    params.require(:cause).permit(
      :name,
      :owner,
      :description,
      :fund_target,
      :hour_target,
      :start_date,
      :end_date,
      :status,
      :org_id
    )
  end
end
