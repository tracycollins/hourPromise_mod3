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

    self.save

    return self

  end

end
