class Cause < ApplicationRecord
  belongs_to :org
  has_many :commitments
  has_many :users, through: :commitments

  def update_stats
    self.fund_donated = 0
    self.hour_donated = 0
    self.commitments.each { |commitment|
      self.fund_donated += commitment.fund_donated
      self.hour_donated += commitment.hour_donated
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

    return self

  end

end
