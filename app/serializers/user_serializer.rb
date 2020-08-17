class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :username, :address, :bio, :interests
end
