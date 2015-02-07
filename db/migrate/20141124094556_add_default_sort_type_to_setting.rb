class AddDefaultSortTypeToSetting < ActiveRecord::Migration
  def change
    add_column :settings, :default_sort_type, :string, default: 'firm'
  end
end
