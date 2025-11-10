#!/bin/bash

###############################################################################
# check-warnings.sh - Check for code quality warnings in Java test files
#
# Usage: ./check-warnings.sh
#
# This script checks for:
# 1. Maven compilation warnings
# 2. Unused imports
# 3. Common code smells
#
# Run this BEFORE committing to ensure clean codebase!
###############################################################################

echo "🔍 Checking for code quality warnings..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter
WARNINGS=0

# 1. Check Maven compilation warnings
echo "📦 Checking Maven compilation warnings..."
MAVEN_WARNINGS=$(mvn clean compile test-compile 2>&1 | grep -i "\[WARNING\]" | wc -l)

if [ "$MAVEN_WARNINGS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $MAVEN_WARNINGS Maven warnings${NC}"
    mvn clean compile test-compile 2>&1 | grep -i "\[WARNING\]" | head -10
    WARNINGS=$((WARNINGS + MAVEN_WARNINGS))
else
    echo -e "${GREEN}✅ No Maven compilation warnings${NC}"
fi

echo ""

# 2. Check for unused imports (common patterns)
echo "📝 Checking for common unused imports..."

UNUSED_COUNT=0

# Check MultipartFile (we use MockMultipartFile instead)
MULTIPART=$(find src/test -name "*.java" -exec grep -l "import org.springframework.web.multipart.MultipartFile;" {} \; 2>/dev/null | wc -l)
if [ "$MULTIPART" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found unused MultipartFile imports in $MULTIPART files${NC}"
    find src/test -name "*.java" -exec grep -l "import org.springframework.web.multipart.MultipartFile;" {} \;
    UNUSED_COUNT=$((UNUSED_COUNT + MULTIPART))
fi

# Check ArgumentMatchers.eq
EQ_IMPORT=$(find src/test -name "*.java" -exec grep -l "import static org.mockito.ArgumentMatchers.eq;" {} \; 2>/dev/null | wc -l)
if [ "$EQ_IMPORT" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found unused ArgumentMatchers.eq imports in $EQ_IMPORT files${NC}"
    find src/test -name "*.java" -exec grep -l "import static org.mockito.ArgumentMatchers.eq;" {} \;
    UNUSED_COUNT=$((UNUSED_COUNT + EQ_IMPORT))
fi

# Check ArgumentMatchers.anyString
ANYSTRING=$(find src/test -name "*.java" -exec grep -l "import static org.mockito.ArgumentMatchers.anyString;" {} \; 2>/dev/null | wc -l)
if [ "$ANYSTRING" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found unused ArgumentMatchers.anyString imports in $ANYSTRING files${NC}"
    find src/test -name "*.java" -exec grep -l "import static org.mockito.ArgumentMatchers.anyString;" {} \;
    UNUSED_COUNT=$((UNUSED_COUNT + ANYSTRING))
fi

if [ "$UNUSED_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ No common unused imports found${NC}"
fi

WARNINGS=$((WARNINGS + UNUSED_COUNT))

echo ""

# 3. Run tests to ensure everything passes
echo "🧪 Running tests..."
mvn test -q > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passing${NC}"
else
    echo -e "${RED}❌ Tests failing! Run 'mvn test' for details${NC}"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Final summary
if [ "$WARNINGS" -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Code is clean!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Found $WARNINGS warnings/issues${NC}"
    echo "Please fix warnings before committing!"
    exit 1
fi
