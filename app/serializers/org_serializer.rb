class OrgSerializer < ActiveModel::Serializer
  attributes :id, :name, :tagline, :info, :address, :interests
  has_many :causes
end
