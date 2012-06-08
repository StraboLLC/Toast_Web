class AlbumHash < ActiveRecord::Migration
  def change
  	add_column :albums, :hash, :string
  end
end
