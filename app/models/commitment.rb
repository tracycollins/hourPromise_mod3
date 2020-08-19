class Commitment < ApplicationRecord
  has_many :payments
  belongs_to :user
  belongs_to :cause

  def apply_payment(payment)
    self.fund_donated = 0
    self.hour_donated = 0
    self.payments.each { |payment|
      self.fund_donated += payment.fund_amount
      self.hour_donated += payment.hour_amount
    }
  end
end
