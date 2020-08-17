class PaymentSerializer < ActiveModel::Serializer
  attributes :id, :date, :fund_amount, :hour_amount
end
