import 'package:flutter_test/flutter_test.dart';
import 'package:hoot/core/utils/validators.dart';
import 'package:hoot/core/constants/app_constants.dart';

void main() {
  group('Validators', () {
    group('validateEmail', () {
      test('should return null for valid email', () {
        expect(Validators.validateEmail('test@example.com'), isNull);
        expect(Validators.validateEmail('user.name@domain.co.uk'), isNull);
      });

      test('should return error for invalid email', () {
        expect(Validators.validateEmail(null), isNotNull);
        expect(Validators.validateEmail(''), isNotNull);
        expect(Validators.validateEmail('invalid'), isNotNull);
        expect(Validators.validateEmail('test@'), isNotNull);
        expect(Validators.validateEmail('@example.com'), isNotNull);
      });

      test('should return error for too long email', () {
        final longEmail = '${'a' * 250}@example.com';
        expect(Validators.validateEmail(longEmail), isNotNull);
      });
    });

    group('validatePassword', () {
      test('should return null for valid password', () {
        expect(Validators.validatePassword('Test123!@#'), isNull);
        expect(Validators.validatePassword('MyP@ssw0rd'), isNull);
      });

      test('should return error for missing requirements', () {
        expect(Validators.validatePassword(''), isNotNull);
        expect(Validators.validatePassword('short'), isNotNull);
        expect(Validators.validatePassword('NoNumbers!'), isNotNull);
        expect(Validators.validatePassword('nouppERcase1!'), isNotNull);
        expect(Validators.validatePassword('NOLOWERCASE1!'), isNotNull);
        expect(Validators.validatePassword('NoSpecial123'), isNotNull);
      });

      test('should enforce minimum length', () {
        final shortPassword = 'Ab1!';
        expect(Validators.validatePassword(shortPassword), contains('at least'));
      });
    });

    group('validateUsername', () {
      test('should return null for valid username', () {
        expect(Validators.validateUsername('john_doe'), isNull);
        expect(Validators.validateUsername('user123'), isNull);
        expect(Validators.validateUsername('Test_User'), isNull);
      });

      test('should return error for invalid username', () {
        expect(Validators.validateUsername(''), isNotNull);
        expect(Validators.validateUsername('ab'), isNotNull); // Too short
        expect(Validators.validateUsername('user@name'), isNotNull); // Invalid char
        expect(Validators.validateUsername('user name'), isNotNull); // Space
      });
    });

    group('validateRecordingDuration', () {
      test('should return null for valid duration', () {
        expect(Validators.validateRecordingDuration(5), isNull);
        expect(Validators.validateRecordingDuration(60), isNull);
        expect(Validators.validateRecordingDuration(180), isNull);
      });

      test('should return error for too short duration', () {
        expect(
          Validators.validateRecordingDuration(0),
          contains('too short'),
        );
      });

      test('should return error for too long duration', () {
        expect(
          Validators.validateRecordingDuration(301),
          contains('too long'),
        );
      });
    });

    group('sanitizeFileName', () {
      test('should remove directory traversal', () {
        expect(
          Validators.sanitizeFileName('../../../etc/passwd'),
          equals('____________etc_passwd'),
        );
      });

      test('should remove special characters', () {
        expect(
          Validators.sanitizeFileName('file<>:"|?*.mp3'),
          equals('file_________.mp3'),
        );
      });

      test('should limit length', () {
        final longName = '${'a' * 300}.mp3';
        final sanitized = Validators.sanitizeFileName(longName);
        expect(sanitized.length, lessThanOrEqualTo(255));
      });
    });
  });
}
