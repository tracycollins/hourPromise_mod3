class PaymentSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :commitment_id, :date, :fund_amount, :hour_amount
end
