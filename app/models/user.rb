class User < ApplicationRecord
  has_many :payments
  has_many :commitments, through: :payments
  has_many :causes, through: :commitments
end
