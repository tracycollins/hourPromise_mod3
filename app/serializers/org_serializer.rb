class OrgSerializer < ActiveModel::Serializer
  attributes :id, :name, :tagline, :info, :address, :interests
end
