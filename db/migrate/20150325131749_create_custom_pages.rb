class CreateCustomPages < ActiveRecord::Migration
  def change
    create_table :custom_pages do |t|
      t.string :label
      t.text :body
      t.string :title
      t.text :keywords
      t.text :description
      t.string :color

      t.timestamps null: false
    end
  end
end
