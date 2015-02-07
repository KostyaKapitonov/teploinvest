class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string :url
      t.boolean :is_main

      t.timestamps null: false
    end
  end
end
