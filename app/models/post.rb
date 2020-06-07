class Post < ApplicationRecord
  # mount_uploader :image, ImageUploader
  # no Association
  validates :title, presence: true
  validates :content, presence: true
end
