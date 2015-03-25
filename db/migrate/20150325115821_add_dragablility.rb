class AddDragablility < ActiveRecord::Migration

  def change

    add_column :categories, :is_default, :boolean, default: false
    add_column :categories, :view_seq, :integer
    add_column :categories, :edit_seq, :integer

    add_column :sub_cats, :is_default, :boolean, default: false
    add_column :sub_cats, :view_seq, :integer
    add_column :sub_cats, :edit_seq, :integer

    add_column :firms, :is_default, :boolean, default: false
    add_column :firms, :view_seq, :integer
    add_column :firms, :edit_seq, :integer

    Category.all.each_with_index do |c, i|
      c.update(view_seq: i+1,edit_seq: i+1)
    end
    SubCat.all.each_with_index do |c, i|
      c.update(view_seq: i+1,edit_seq: i+1)
    end
    Firm.all.each_with_index do |c, i|
      c.update(view_seq: i+1,edit_seq: i+1)
    end

    Category.create(name: 'Отсутствует', view_seq: 0,edit_seq: 0, is_default: true)
    SubCat.create(name: 'Отсутствует', view_seq: 0,edit_seq: 0, is_default: true)
    Firm.create(name: 'Отсутствует', view_seq: 0,edit_seq: 0, is_default: true)

  end

  def down

    remove_column :categories, :is_default
    remove_column :categories, :view_seq
    remove_column :categories, :edit_seq

    remove_column :sub_cats, :is_default
    remove_column :sub_cats, :view_seq
    remove_column :sub_cats, :edit_seq

    remove_column :firms, :is_default
    remove_column :firms, :view_seq
    remove_column :firms, :edit_seq

  end

end
