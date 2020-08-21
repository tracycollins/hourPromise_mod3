class CauseSerializer < ActiveModel::Serializer
  attributes :id, :name, :org, :description, :fund_goal, :fund_donated, :fund_status, :hour_goal, :hour_donated, :hour_status, :start_date, :end_date, :status
end
