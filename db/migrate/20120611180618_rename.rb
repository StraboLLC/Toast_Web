class Rename < ActiveRecord::Migration
  def change 
  	remove_column :albums, :uploaded_at
  	add_column :albums, :taken_at, :datetime
  end
end
