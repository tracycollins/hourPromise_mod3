class Commitment < ApplicationRecord
  has_many :payments
  belongs_to :user
  belongs_to :cause

  def update_stats

    self.fund_donated = 0
    self.hour_donated = 0

    self.payments.each { |payment|
      self.fund_donated += payment.fund_amount
      self.hour_donated += payment.hour_amount
    }

    if self.fund_donated >= self.fund_goal
      self.fund_status = "funded"
    end

    if self.hour_donated >= self.hour_goal
      self.hour_status = "funded"
    end

    if self.fund_status === "funded" && self.hour_status === "funded"
      self.status = "funded"
    end

    self.save
    self.cause.update_stats

    return self

  end

end
