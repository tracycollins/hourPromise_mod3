class CommitmentSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :cause_id, :fund_start_date, :fund_end_date, :fund_goal, :fund_amount, :fund_recurring, :fund_donated, :hour_start_date, :hour_end_date, :hour_goal, :hour_amount, :hour_recurring, :hour_donated, :status
  belongs_to :cause
  has_many :payments
end
