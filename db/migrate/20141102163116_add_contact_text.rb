class AddContactText < ActiveRecord::Migration
  def change
    add_column :settings, :contacts_text, :text
  end
end
