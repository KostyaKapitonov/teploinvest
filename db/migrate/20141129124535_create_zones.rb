class CreateZones < ActiveRecord::Migration
  def change
    create_table :zones do |t|
      t.string :name
      t.string :color
      t.float :price

      t.timestamps null: false
    end
  end
end