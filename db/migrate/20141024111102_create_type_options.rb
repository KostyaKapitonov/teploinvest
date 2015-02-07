class CreateTypeOptions < ActiveRecord::Migration
  def change
    create_table :type_options do |t|
      t.string :name

      t.timestamps null: false
    end
  end
end
