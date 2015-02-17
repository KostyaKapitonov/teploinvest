class AddFieldsToSettings < ActiveRecord::Migration
  def change

    add_column :settings, :about_text, :text
    add_column :settings, :price_list_text, :text
    add_column :settings, :payment_and_delivery_text, :text
    add_column :settings, :installation_text, :text

  end
end
