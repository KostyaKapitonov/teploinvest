class AddMapCodeFieldToSetting < ActiveRecord::Migration
  def change
    add_column :settings, :map_code, :string
  end
end
