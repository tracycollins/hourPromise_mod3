class Org < ApplicationRecord
  has_many :causes
  has_many :commitments, through: :causes
end
