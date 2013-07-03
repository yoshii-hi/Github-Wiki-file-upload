#!/usr/bin/ruby
# -*- coding: utf-8 -*-

require 'cgi'

cgi = CGI.new
print "Access-Control-Allow-Origin: *\n"
print "Content-type: text/plain\n\n"

if ENV['REQUEST_METHOD'] == "POST" then
  file = cgi['file']
  # store file
  file_path = "directory_path/#{file.original_filename}"
  open(file_path, "w") {|f| f.write file.read }
  `sh ../../test.sh`
  print "[[image/#{file.original_filename}]]"
elsif  ENV['REQUEST_METHOD'] == "GET" then
  print `sh ../../push.sh`
  print "get ok"
end
