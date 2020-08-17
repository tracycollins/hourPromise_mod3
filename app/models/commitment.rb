class Commitment < ApplicationRecord
  has_many :payments
  belongs_to :user
  belongs_to :cause
end
