class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :username, :address, :bio, :interests
  has_many :commitments
end
