class ChangeAlbumHash < ActiveRecord::Migration
  def change
  	remove_column :albums, :hash
  	add_column :albums, :album_token, :string
  end
end
