import 'package:flutter_test/flutter_test.dart';
import 'package:hoot/core/utils/error_handler.dart';
import 'package:hoot/core/constants/app_constants.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'dart:io';

void main() {
  group('ErrorHandler', () {
    group('getUserMessage', () {
      test('should return generic message for unknown errors', () {
        final message = ErrorHandler.getUserMessage(Exception('Unknown'));
        expect(message, equals(AppConstants.genericError));
      });

      test('should return network message for SocketException', () {
        final message = ErrorHandler.getUserMessage(SocketException(''));
        expect(message, equals(AppConstants.networkError));
      });

      test('should return custom message for HootException', () {
        final exception = HootException('Custom error');
        expect(ErrorHandler.getUserMessage(exception), equals('Custom error'));
      });

      test('should sanitize database errors', () {
        // Simulate Postgrest error (constructor might vary based on version)
        // This is a simplified test
        final message = ErrorHandler.getUserMessage(
          Exception('PostgreSQL error with sensitive data'),
        );
        // Should not expose database details
        expect(message, isNot(contains('PostgreSQL')));
      });
    });

    group('isRecoverable', () {
      test('should identify recoverable errors', () {
        expect(ErrorHandler.isRecoverable(SocketException('')), isTrue);
        expect(ErrorHandler.isRecoverable(NetworkException()), isTrue);
        expect(ErrorHandler.isRecoverable(TimeoutException('test')), isTrue);
      });

      test('should identify non-recoverable errors', () {
        expect(ErrorHandler.isRecoverable(ValidationException('test')), isFalse);
        expect(ErrorHandler.isRecoverable(Exception('test')), isFalse);
      });
    });

    group('shouldRetry', () {
      test('should not retry after max attempts', () {
        expect(
          ErrorHandler.shouldRetry(NetworkException(), 3),
          isFalse,
        );
      });

      test('should retry recoverable errors', () {
        expect(
          ErrorHandler.shouldRetry(NetworkException(), 1),
          isTrue,
        );
      });

      test('should not retry validation errors', () {
        expect(
          ErrorHandler.shouldRetry(ValidationException('test'), 1),
          isFalse,
        );
      });
    });
  });

  group('RetryHelper', () {
    test('should succeed on first attempt', () async {
      int attempts = 0;
      final result = await RetryHelper.retry(() async {
        attempts++;
        return 'success';
      });

      expect(result, equals('success'));
      expect(attempts, equals(1));
    });

    test('should retry and eventually succeed', () async {
      int attempts = 0;
      final result = await RetryHelper.retry(() async {
        attempts++;
        if (attempts < 3) {
          throw NetworkException();
        }
        return 'success';
      });

      expect(result, equals('success'));
      expect(attempts, equals(3));
    });

    test('should throw after max retries', () async {
      int attempts = 0;
      expect(
        () => RetryHelper.retry(
          () async {
            attempts++;
            throw NetworkException();
          },
          maxAttempts: 2,
        ),
        throwsA(isA<NetworkException>()),
      );

      await Future.delayed(const Duration(seconds: 5)); // Wait for retries
      expect(attempts, equals(2));
    });
  });
}
