class DropPasswordDigestAddPassword < ActiveRecord::Migration
  def change
  	remove_column :users, :password_digest
  	add_column :users, :password, :string
  end
end
