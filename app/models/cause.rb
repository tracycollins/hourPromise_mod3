class Cause < ApplicationRecord
  belongs_to :org
  has_many :commitments
  has_many :users, through: :commitments
end
