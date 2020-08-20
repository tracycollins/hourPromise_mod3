class CauseSerializer < ActiveModel::Serializer
  attributes :id, :name, :org, :description, :fund_target, :fund_donated, :hour_target, :hour_donated, :start_date, :end_date, :status
end
