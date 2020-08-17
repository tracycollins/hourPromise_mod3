class Payment < ApplicationRecord
  belongs_to :commitment
  has_one :user, through: :commitment
end
