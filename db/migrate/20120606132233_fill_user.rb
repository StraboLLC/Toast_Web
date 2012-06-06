class FillUser < ActiveRecord::Migration
  def change
  	remove_column :users, :name
	add_column :users, :first_name, :string
	add_column :users, :last_name, :string
	add_column :users, :email, :string
	add_column :users, :password, :string
	add_column :users, :address, :string
	add_column :users, :city, :string
	add_column :users, :state, :string
	add_column :users, :zip, :integer
	add_column :users, :paid_at, :datetime
	add_column :users, :expires_at, :datetime
  end
end
