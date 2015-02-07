class AddDepColToProduct < ActiveRecord::Migration
  def change
    add_column :products, :type_option_id, :integer
  end
end
