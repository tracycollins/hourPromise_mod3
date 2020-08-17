class CommitmentSerializer < ActiveModel::Serializer
  attributes :id, :created_date, :start_date, :fund_amount, :fund_recurring, :funds_donated, :hour_amount, :hour_recurring, :hours_donated, :status
end
