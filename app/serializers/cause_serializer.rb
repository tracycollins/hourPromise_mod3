class CauseSerializer < ActiveModel::Serializer
  attributes :id, :name, :owner, :description, :fund_target, :hour_target, :start_date, :end_date, :status
end
