class CreateSettings < ActiveRecord::Migration
  def change
    create_table :settings do |t|
      t.text :main_page_text
      t.string :main_page_img

      t.timestamps null: false
    end
  end
end
