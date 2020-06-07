class ChangeDataImageToPost < ActiveRecord::Migration[5.2]
  def change
    change_column :posts, :image, :binary, limit: 10.megabyte
  end
end
