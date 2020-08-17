class CreateOrgs < ActiveRecord::Migration[6.0]
  def change
    create_table :orgs do |t|
      t.string :name
      t.string :tagline
      t.string :info
      t.string :address
      t.string :interests

      t.timestamps
    end
  end
end
