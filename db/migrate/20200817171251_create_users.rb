class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :username
      t.string :address
      t.string :bio
      t.string :interests

      t.timestamps
    end
  end
end
